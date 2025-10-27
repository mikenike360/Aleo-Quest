import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Get the content directory - works in both dev and production
function getContentDirectory() {
  // During build, files are in .next/server folder, so we need to find the actual project root
  const libDir = __dirname;
  
  // If we're in .next folder, remove .next from the path to get to project root
  let projectRoot = libDir;
  if (libDir.includes('.next')) {
    projectRoot = libDir.split('.next')[0];
  } else if (libDir.includes('node_modules')) {
    // If somehow we're in node_modules, go up to find project root
    projectRoot = libDir.replace(/node_modules.*/, '');
  }
  
  // Look for content/learn relative to project root
  const contentPath = path.join(projectRoot, 'content', 'learn');
  
  if (fs.existsSync(contentPath)) {
    console.log(`✓ Found content directory at: ${contentPath}`);
    return contentPath;
  }
  
  // If that didn't work, try the working directory
  const cwdPath = path.join(process.cwd(), 'content', 'learn');
  if (fs.existsSync(cwdPath)) {
    console.log(`✓ Found content directory at (cwd): ${cwdPath}`);
    return cwdPath;
  }
  
  console.warn(`⚠ Could not find content directory`);
  console.warn(`Lib dir: ${libDir}`);
  console.warn(`Project root: ${projectRoot}`);
  console.warn(`CWD: ${process.cwd()}`);
  
  // Return the expected path anyway
  return contentPath;
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

