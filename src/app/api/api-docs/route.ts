// import { NextResponse } from 'next/server';

// export async function GET() {
//   const html = `
//     <!DOCTYPE html>
//     <html lang="uk">
//       <head>
//         <title>Card&Board API - Swagger UI</title>
//         <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.28.0/swagger-ui.css" />
//       </head>
//       <body>
//         <div id="swagger-ui"></div>
//         <script src="https://unpkg.com/swagger-ui-dist@5.28.0/swagger-ui-bundle.js"></script>
//         <script>
//           window.onload = () => {
//             window.ui = SwaggerUIBundle({
//               url: '/api/docs',
//               dom_id: '#swagger-ui',
//               deepLinking: true,
//             });
//           };
//         </script>
//       </body>
//     </html>
//   `;

//   return new NextResponse(html, {
//     headers: {
//       'Content-Type': 'text/html',
//       'Access-Control-Allow-Origin': '*',
//     },
//   });
// }