interface Props {
  children: React.ReactNode;
}

const Page = ({ children }: Props) => {
  return <section className="p-6 max-[872px]:p-4 h-full flex flex-col overflow-auto">{children}</section>;
};

export default Page;
