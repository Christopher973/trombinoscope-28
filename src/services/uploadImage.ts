import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Assurez-vous que le répertoire existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function uploadImage(base64Image: string): Promise<string> {
  // Extraire les données de l'image de la chaîne base64
  const matches = base64Image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid image format');
  }
  
  const fileExtension = matches[1].split('/')[1].replace('+', '');
  const fileData = Buffer.from(matches[2], 'base64');
  
  // Générer un nom de fichier unique
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);
  
  // Écrire le fichier sur le disque
  fs.writeFileSync(filePath, fileData);
  
  // Retourner l'URL relative
  return `/uploads/${fileName}`;
}