export const structure = (S: any, context: any) =>
  S.list().title("Content").items([S.divider()]);

export const defaultDocumentNode = (S: any, props: any) => {
  const { schemaType } = props;

  return S.document().views([S.view.form()]);
};

export default structure;
