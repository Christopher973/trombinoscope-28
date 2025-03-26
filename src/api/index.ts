import { startApolloServer } from './graphql/server';

// Démarrage du serveur Apollo
console.log("Starting Apollo Server...");
startApolloServer().catch(err => {
  console.error('Failed to start Apollo Server:', err);
});