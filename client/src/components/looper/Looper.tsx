import CustomButton from "../custombutton/CustomButton";

function Looper({ nButtons, buttonLabels }) {
    const customButtons = [];

    for (let i = 0; i < nButtons; i++) {
      let label = buttonLabels[i] || `i`;
      if(i == nButtons - 1){
        label = '...'
      }
      customButtons.push(
        <CustomButton
          key={i}
          action={() => console.log(`Button ${i + 1} clicked!`)}
          label={label}
        />
      );
    }

  return <div>{customButtons}</div>;
}

export default Looper