import type { MDXComponents } from 'mdx/types';
import { Callout } from '@/components/Callout';
import { Quiz } from '@/components/Quiz';
import { Diagram } from '@/components/Diagram';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Callout,
    Quiz,
    Diagram,
    ...components,
  };
}

