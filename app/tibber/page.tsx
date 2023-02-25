export const revalidate = 60;

export default async function Page() {
  //displays json data in browser
  return <main>{Date.now()}</main>;
}
