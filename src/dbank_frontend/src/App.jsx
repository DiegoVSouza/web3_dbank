import { useEffect, useState } from 'react';
import { dbank_backend } from 'declarations/dbank_backend';

function App() {
  const [currentValue, setCurrentValue] = useState(0);
  const [valueUp, setValueUp] = useState();
  const [valueDown, setValueDown] = useState();
  const [isDisable, setIsDisable] = useState(false);

  useEffect(() => {
    getCurrentValue()
  }, [])
  

  async function getCurrentValue() {
    let currentValue = await dbank_backend.checkBalance()
    if (currentValue)
      setCurrentValue(currentValue)
  }
  
  async function handleSubmit() {
    setIsDisable(true)
    if (valueUp > 0){
      await dbank_backend.topUp(parseFloat(valueUp))
      setValueUp('')
    }
    if (valueDown > 0) {
      await dbank_backend.withdraw(parseFloat(valueDown))
      setValueDown('')
    }
    await dbank_backend.compound()
    await getCurrentValue().then(()=>{
      setIsDisable(false)
    })
  }

  return (
    <main>
      <div className="container">
        <img src="dbank_logo.png" alt="DBank logo" width="100" />
        <h1>Current Balance: $<span id="value">{`${currentValue.toFixed(2)}`}</span></h1>
        <div className="divider"></div>
        <form action="#">
          <h2>Amount to Top Up</h2>
          <input id="input-amount" onChange={(e) => setValueUp(e.target.value)} value={valueUp} type="number" step="0.01" min='0' name="topUp" />
          <h2>Amount to Withdraw</h2>
          <input id="withdrawal-amount" onChange={(e) => setValueDown(e.target.value)} value={valueDown} type="number" name="withdraw" step="0.01" min='0' />
          <input id="submit-btn" disabled={isDisable} onClick={() => handleSubmit()} type="submit" value="Finalise Transaction" />
        </form>
      </div>

    </main>
  );
}

export default App;
