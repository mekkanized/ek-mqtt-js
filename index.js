import mqtt from "mqtt";
import * as ed from "@noble/ed25519";
import { Buffer } from "buffer";

import {sha512} from "@noble/hashes/sha512";
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

import streamBuilder from "mqtt/lib/connect/ws";

/**
 * Wraps an mqtt client connector with options
 * @param {mqtt.IClientOptions} opts - Client Options
 * @param {mqtt.StreamBuilder} stream_builder - Stream Builder
 * @returns {mqtt.IStream} - Wrapped stream
 */
function wrap(opts, stream_builder) {
  return function wrapper(client) {
    if(typeof(stream_builder) === 'object'){
      return stream_builder.default(client, opts);
    } else {
      return stream_builder(client, opts);
    }
  }
}

/**
 * Connects to ek MQTT broker and returns an API client
 * @param {string} id - MQTT client ID
 * @param {Uint8Array} key - Client Private Key
 * @param {string} hostname - hostname to connect to
 * @param {integer} port - broker websocket port
 * @returns {mqtt.MqttClient} - Client wrapped with auth handler
 */
export function Connect(id, key, hostname, port) {
  const opts = {protocolVersion: 5, protocol: "ws", clientId: id, host: hostname, port: port, manualConnect: true};
  const client = new mqtt.Client(wrap(opts, streamBuilder), opts);
  client.handleAuth = (packet, _) => {
    let digest = new Uint8Array(packet.properties.authenticationData);
    let signature = ed.sign(digest, key);
    let resp = {
      cmd: 'auth',
      reasonCode: 0,
      properties: {
         authenticationMethod: "ek-signature",
         authenticationData: Buffer.from(signature),
      }
    }
    client._writePacket(resp);
  }

  return client;
}
