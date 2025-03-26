import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { schema } from './schema';
import { createContext } from './context';

export async function startApolloServer() {
  // Créer l'instance du serveur Apollo
  const server = new ApolloServer({
    schema,
  });

  // Démarrer le serveur en mode standalone
  const { url } = await startStandaloneServer(server, {
    context: createContext,
    listen: { port: 4000 },
    // Configuration CORS
    cors: {
      origin: ['http://localhost:5173', 'https://studio.apollographql.com'],
      credentials: true,
    },
  });

  console.log(`🚀 Server ready at: ${url}`);
  
  return { server, url };
}