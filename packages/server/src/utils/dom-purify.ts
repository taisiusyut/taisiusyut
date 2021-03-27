import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window: unknown = new JSDOM('').window;
export const DOMPurify = createDOMPurify(window as Window);
