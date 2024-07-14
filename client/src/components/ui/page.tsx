interface Props {
  children: React.ReactNode;
}

const Page = ({ children }: Props) => {
  return <section className="p-6 h-full flex flex-col gap-4 overflow-auto">{children}</section>;
};

export default Page;
