declare module 'cookie' {
  export default any;
}
declare module 'cookie-signature' {
  const signature: {
    sign: (value: string, secret: string) => string;
    unsign: (value: string, secret: string) => string | false;
  };
  export default signature;
}

declare module 'fastify-cookie/signer' {
  export default function (
    secret: string | string[]
  ): {
    sign: (_value: string, _secret: string) => string | boolean;
    unsign: (
      value: string,
      secret: string
    ) => {
      valid: boolean;
      renew: boolean;
      value: string | null;
    };
  };
}
