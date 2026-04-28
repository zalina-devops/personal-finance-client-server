// Polyfill для TextEncoder / TextDecoder (нужен для react-router v7)
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Подключаем jest-dom matchers
import '@testing-library/jest-dom';