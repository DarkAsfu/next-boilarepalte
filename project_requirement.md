### AI Image Analysis Dashboard
Task

Create a gallery of at least 20 images from Picsum. Clicking an image should request an AI-generated caption and tags. The application should remain usable when several images are clicked in quick succession, show analysis progress, and retain completed results after a refresh.
Constraints
Use Next.js with TypeScript. Use Next.js server-side functionality for all backend logic; no dedicated backend or separate worker service.
Use a database-backed queue. Do not use Redis, BullMQ, or an external queue service.
Anthropic API access will be supplied separately. Keep the key on the server and out of source control.
AI coding tools and documentation are allowed.

### Picsum API reference
Base URL: https://picsum.photos
Authentication: no API key required.
Purpose
GET endpoint
Response
List images
/v2/list?page=1&limit=20
JSON array of image metadata
Get one image's metadata
/id/{id}/info
JSON metadata object
Get an image at a chosen size
/id/{id}/{width}/{height}
Image content

Example requests:
https://picsum.photos/v2/list?page=1&limit=20
https://picsum.photos/id/237/info
https://picsum.photos/id/237/1024/768
Metadata fields:
Field
Meaning
id
Image identifier, returned as a string
author
Photographer's name
width, height
Original image dimensions
url
Source photo page
download_url
URL for downloading the image

The list endpoint supports page and limit; the default page size is 30. Use an image ID when requesting a consistent image at different sizes.
Reference: Official Lorem Picsum documentation.


