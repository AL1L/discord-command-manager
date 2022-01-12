export function Error({ errors, name }) {
  if (!errors || !errors[name] || !errors[name]._errors) return null;

  const errorList = errors[name]._errors;

  return <div className="error-list">
    {errorList.map(({ code, message }) => <div key={code}>{message}</div>)}
  </div>;
}