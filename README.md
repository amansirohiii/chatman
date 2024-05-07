# Chatman
Chatman is a real-time chat application built with Next.js, Redis, NextAuth, Pusher.js, Typrescript, Tailwind CSS.

## Features
- Real-time messaging: Experience seamless real-time messaging with Pusher.js integration.
- Authentication: Secure your chat application with NextAuth for easy and secure authentication with Google and Github.
- Responsive UI: Enjoy a responsive and intuitive user interface crafted with Tailwind CSS.
- User-friendly interface: Streamlined design for effortless communication and navigation.
## Technologies Used
- Next.js: Next.js is a React framework that enables server-side rendering, static site generation, and more.
- Redis: Redis is an in-memory data structure store, used for caching and real-time data storage.
- NextAuth: NextAuth provides authentication for Next.js applications with various providers like Google, GitHub, etc.
- Pusher.js: Pusher.js is a library that facilitates real-time communication between servers and clients.
- Tailwind CSS: Tailwind CSS is a utility-first CSS framework for creating custom designs quickly.
## Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/nextchat.git
```
2. Install dependencies:
```bash
cd chatman
npm install
```
3. Set up environment variables:
Create a .env file in the root directory and add the following variables:

```makefile
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET =
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXTAUTH_SECRET=
PUSHER_APP_ID =
NEXT_PUBLIC_PUSHER_APP_KEY =
PUSHER_APP_SECRET =
PUSHER_APP_CLUSTER =
```

4. Run the development server:
```bash
npm run dev
```
## Usage
Once the development server is running, visit http://localhost:3000 in your web browser to access the application. Sign up or log in to start chatting with others in real-time.

## Contributing
Contributions are welcome! Feel free to open issues or pull requests for any improvements or bug fixes.


