const AssetAllocationForm = (props) => {
  let investmentFields = [];
  
  for (let i = 0; i < props.investmentCount; i++){
    investmentFields.push(
      <div>
        <div>
          <label>Investment {i + 1}</label>
        </div>

        {(props.assetAllocationType === "fixed") ?

        <input type="text" placeholder={`Percent Allocation`} />
        :
        <>
        <input type="text" placeholder={`Percent Allocation Before`} />
        <input type="text" placeholder={`Percent Allocation After`} />
        </>
        }

        <div>
          <label>
            <input type="radio" name={`investment${i}`} value="nonretirement" />
            Non-retirement
          </label>
          <label>
            <input type="radio" name={`investment${i}`} value="pretax" />
            Pre-tax
          </label>
          <label>
            <input type="radio" name={`investment${i}`} value="aftertax" />
            After-tax
          </label>
        </div>

      </div>
    )
  }
  return investmentFields;

}


export default AssetAllocationForm;
