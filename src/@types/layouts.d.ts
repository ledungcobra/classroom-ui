interface IHeaderFooterLayout {
  header: JSX.Element;
  children: JSX.Element;
  footer: JSX.Element;
}

interface IOnlyHeaderLayout {
  header: JSX.Element;
  children: JSX.Element;
}

interface IOnlyFooterLayout {
  children: JSX.Element;
  footer: JSX.Element;
}

type AddMemberVariant = 'teacher' | 'student';
