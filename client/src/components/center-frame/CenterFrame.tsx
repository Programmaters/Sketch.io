import './Frame.scss';


function Frame(props: { children: React.ReactNode }) {
  return (
    <div className="frame">
      {props.children}
    </div>
  );
}

export default Frame;
