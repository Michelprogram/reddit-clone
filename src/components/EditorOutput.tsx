import dynamic from "next/dynamic";
import { FC } from "react";
import Image from "next/image";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  {
    ssr: false,
  }
);

interface EditorOutputProps {
  content: any;
}

const style = {
  paragraphe: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

const CustomImageRenderer = ({ data }: any) => {
  const src = data.file.url;

  return (
    <div className="relative w-full min-h-[15rem]">
      <Image alt="img" className="object-contain" fill src={src} />
    </div>
  );
};

const CustomCodeRenderer = ({ data }: any) => {
  return (
    <pre className="bg-gray-800 rounded-md p-4">
      <code className="text-gray-100 text-sm">{data.code}</code>
    </pre>
  );
};

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <Output
      data={content}
      style={style}
      className="text-sm"
      renderes={renderers}
    />
  );
};

export default EditorOutput;
