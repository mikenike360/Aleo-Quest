import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Get the content directory - works in both dev and production
function getContentDirectory() {
  const possiblePaths = [
    path.join(process.cwd(), 'content', 'learn'),
    path.join(process.cwd(), '..', 'content', 'learn'),
    '/home/mikenike/Aleo_Quest/aleo-starter-template/content/learn',
  ];
  
  for (const dir of possiblePaths) {
    if (fs.existsSync(dir)) {
      return dir;
    }
  }
  
  // Default to first path if none exist
  return possiblePaths[0];
}

const contentDirectory = getContentDirectory();

export interface StepFrontmatter {
  id: string;
  title: string;
  summary: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface StepContent {
  frontmatter: StepFrontmatter;
  content: string;
}

export function getStepContent(slug: string): StepContent | null {
  try {
    const filePath = path.join(contentDirectory, `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`MDX file not found: ${filePath}`);
      console.error(`Content directory: ${contentDirectory}`);
      console.error(`Working directory: ${process.cwd()}`);
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    return {
      frontmatter: data as StepFrontmatter,
      content,
    };
  } catch (error) {
    console.error(`Error loading MDX content for ${slug}:`, error);
    console.error(`Content directory: ${contentDirectory}`);
    return null;
  }
}

export function getAllStepSlugs(): string[] {
  try {
    if (!fs.existsSync(contentDirectory)) {
      console.error(`Content directory does not exist: ${contentDirectory}`);
      console.error(`Working directory: ${process.cwd()}`);
      return [];
    }
    
    const files = fs.readdirSync(contentDirectory);
    const slugs = files
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => file.replace('.mdx', ''));
    
    console.log(`Found ${slugs.length} MDX files in ${contentDirectory}:`, slugs);
    return slugs;
  } catch (error) {
    console.error('Error reading content directory:', error);
    console.error(`Content directory: ${contentDirectory}`);
    return [];
  }
}

