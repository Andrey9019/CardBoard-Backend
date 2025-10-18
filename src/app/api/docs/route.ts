// import { NextResponse } from 'next/server';
// import swaggerJsdoc from 'swagger-jsdoc';

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Card&Board API',
//       version: '1.0.0',
//       description: 'API для інтернет-магазину настільних ігор Card&Board',
//     },
//     servers: [{ url: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001' }],
//   },
//   apis: ['./src/app/api/**/route.ts'],
// };

// const specs = swaggerJsdoc(options);

// export async function GET() {
//   return  NextResponse.json(specs)
// }


import { NextResponse } from 'next/server';

export async function GET(req: Request) {
const {searchParams} = new URL(req.url);
const format = searchParams.get('format');

if (format === 'json') {
return NextResponse.json({},{headers:{'Access-Control-Allow-Origin':'*'}});
}

  const html = `
  <!DOCTYPE html>
    <html lang="uk">
      <head>
        <title>Card&Board API - Swagger UI</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.28.0/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.28.0/swagger-ui-bundle.js"></script>
        <script>
          window.onload = () => {
            window.ui = SwaggerUIBundle({
              url: '/swagger.json',
              dom_id: '#swagger-ui',
              deepLinking: true,
            });
          };
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*',
    },
  });
}