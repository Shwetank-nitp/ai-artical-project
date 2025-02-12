import React from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

interface DecoratedMarkdownProps {
  content: string;
  className?: string;
}

// Updated ChildrenProps to make children optional
interface ChildrenProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  children?: React.ReactNode;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
}

const customComponents: Components = {
  h1: ({ children, className, ...props }: ChildrenProps) => (
    <h1
      className={`text-4xl font-bold text-indigo-800 mb-6 mt-8 border-b-2 border-indigo-200 pb-2 ${className}`}
      {...props}
    >
      {children}
    </h1>
  ),

  h2: ({ children, className, ...props }: ChildrenProps) => (
    <h2
      className={`text-3xl font-semibold text-indigo-700 mb-4 mt-6 ${className}`}
      {...props}
    >
      {children}
    </h2>
  ),

  h3: ({ children, className, ...props }: ChildrenProps) => (
    <h3
      className={`text-2xl font-medium text-indigo-600 mb-3 mt-5 ${className}`}
      {...props}
    >
      {children}
    </h3>
  ),

  p: ({ children, className, ...props }: ChildrenProps) => (
    <p
      className={`text-gray-700 leading-relaxed mb-4 text-lg ${className}`}
      {...props}
    >
      {children}
    </p>
  ),

  ul: ({ children, className, ...props }: ChildrenProps) => (
    <ul
      className={`list-disc list-inside space-y-2 mb-4 ml-4 ${className}`}
      {...props}
    >
      {children}
    </ul>
  ),

  ol: ({ children, className, ...props }: ChildrenProps) => (
    <ol
      className={`list-decimal list-inside space-y-2 mb-4 ml-4 ${className}`}
      {...props}
    >
      {children}
    </ol>
  ),

  li: ({ children, className, ...props }: ChildrenProps) => (
    <li className={`text-gray-700 mb-1 ${className}`} {...props}>
      {children}
    </li>
  ),

  blockquote: ({ children, className, ...props }: ChildrenProps) => (
    <blockquote
      className={`border-l-4 border-indigo-300 pl-4 my-4 italic text-gray-600 ${className}`}
      {...props}
    >
      {children}
    </blockquote>
  ),

  code: ({ inline, className, children, ...props }: CodeProps) => {
    const codeClass = "rounded bg-opacity-75 font-mono text-sm";
    return inline ? (
      <code
        className={`${codeClass} bg-gray-100 text-indigo-600 px-1 py-0.5 ${className}`}
        {...props}
      >
        {children}
      </code>
    ) : (
      <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto">
        <code className={`${codeClass} ${className}`} {...props}>
          {children}
        </code>
      </pre>
    );
  },

  a: ({ href, children, className, ...props }: LinkProps) => (
    <a
      href={href}
      className={`text-indigo-600 hover:text-indigo-800 underline decoration-2 decoration-indigo-200 hover:decoration-indigo-400 transition-colors ${className}`}
      rel="noopener noreferrer"
      target="_blank"
      {...props}
    >
      {children}
    </a>
  ),

  strong: ({ children, className, ...props }: ChildrenProps) => (
    <strong className={`font-bold text-indigo-900 ${className}`} {...props}>
      {children}
    </strong>
  ),

  em: ({ children, className, ...props }: ChildrenProps) => (
    <em className={`italic text-indigo-700 ${className}`} {...props}>
      {children}
    </em>
  ),

  hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr
      className={`my-8 border-t-2 border-indigo-100 ${className}`}
      {...props}
    />
  ),

  img: ({
    src,
    alt,
    className,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      src={src}
      alt={alt}
      className={`my-4 rounded-lg shadow-md max-w-full h-auto ${className}`}
      {...props}
    />
  ),
};

const DecoratedMarkdown: React.FC<DecoratedMarkdownProps> = ({
  content,
  className = "",
}) => {
  return (
    <div
      className={`max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg ${className}`}
    >
      <ReactMarkdown
        components={customComponents}
        className="prose prose-indigo max-w-none"
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default DecoratedMarkdown;
