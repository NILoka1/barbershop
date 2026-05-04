interface HelloProps {
  name?: string;
}

export const Hello = ({ name = 'Мир' }: HelloProps) => {
  return <h1>Привет, {name}!</h1>;
};
