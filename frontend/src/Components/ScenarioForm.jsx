import { useState } from 'react'; 

const ScenerioForm = (props) => {
  
    const [name, setName] = useState("")
    const [isMarried, setIsMarried] = useState("")
    const [birthYear, setBirthYear] = useState("")


    return (
        <div>
            <h1>Scenerio</h1>

            <div>
                <span>Name</span>
                <input type="text" onChange={(e) => setName(e.target.value)} ></input>
        </div>
        </div>

    
  )
}

export default ScenerioForm;