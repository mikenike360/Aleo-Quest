import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { StepClient } from './StepClient';
import { getStepContent, getAllStepSlugs } from '@/lib/mdx';
import { getStepBySlug, getNextStep, getPrevStep } from '@/lib/steps';
import { Callout } from '@/components/Callout';
import { Quiz } from '@/components/Quiz';
import { Diagram } from '@/components/Diagram';

const components = {
  Callout,
  Quiz,
  Diagram,
};

export async function generateStaticParams() {
  try {
    const slugs = getAllStepSlugs();
    console.log(`Generating static params for ${slugs.length} learn pages:`, slugs);
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export const dynamicParams = false; // Force static generation

export default function StepPage({ params }: { params: { slug: string } }) {
  const stepContent = getStepContent(params.slug);
  
  if (!stepContent) {
    notFound();
  }

  const step = getStepBySlug(params.slug);
  if (!step) {
    notFound();
  }

  const nextStep = getNextStep(params.slug);
  const prevStep = getPrevStep(params.slug);

  return (
    <StepClient
      title={stepContent.frontmatter.title}
      summary={stepContent.frontmatter.summary}
      slug={params.slug}
      nextStep={nextStep}
      prevStep={prevStep}
    >
      <MDXRemote source={stepContent.content} components={components} />
    </StepClient>
  );
}

