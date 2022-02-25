import React from 'react'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';
import { useState } from 'react';
const api_base="https://secret-meadow-73091.herokuapp.com"
const Todo = () => {
    const [todos,setTodos]=useState([])
    const [popupActive,setPopupActive]=useState(false)
    const [newTodo, setnewTodo] = useState("")
    
	const GetTodos=async()=>{
        await fetch(api_base+"/todos")
        .then(res=>res.json())
        .then(data=>setTodos(data))
        .catch(err=>console.error("Error:",err))

    }
    useEffect(()=>{
        GetTodos();
    },[])


	const Complete=async(id)=>{
		const data=await fetch(api_base+`/todos/complete/${id}`).then(res=>res.json())
		setTodos(todos=>
			todos.map(todo=>{
				if(todo._id===data._id)
				{
					todo.Complete=data.Complete
				}
				return todo
			})
		)
		console.log(todos)
	}

	const deletetodo=async(id)=>{
		const data=await fetch(api_base+`/todo/delete/${id}`,{method:"DELETE"}).then(res=>res.json())
		setTodos(todos => todos.filter(todo => todo._id !== data.result._id));
	}

	const addTodo=async(e)=>{
		e.preventDefault()
		const data = await fetch(api_base + "/todos/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body:JSON.stringify({
				text:newTodo
			})
			
		}).then(res => res.json());

		setTodos([...todos, data]);

		setPopupActive(false);
		setnewTodo("");
	}


  return (
    <div className="Todo-content">
        <div className="todolist">
            <h1>Today's Task</h1>
            {todos.length> 0 ? todos.map(todo=>(
                <div className={"todoele" +(todo.Complete?" is-complete":"")} key={todo._id} >
                    <div className="checkbox"onClick={()=>{Complete(todo._id)}}>

                    </div>
                    <div className="text" onClick={()=>{Complete(todo._id)}}>
                        {todo.text}
                    </div>
                    <div className="delete" onClick={()=>{deletetodo(todo._id)}}>
                        <DeleteOutlineOutlinedIcon/>
                    </div>
                </div>
			)):(<p>You have none</p>
			)}
            </div>
			<div className="popup">
				<div className={"popupplus" +(popupActive?" closeplus":"")} onClick={()=>setPopupActive(true)}><AddIcon/></div>
				{popupActive?(
					<div className="popupmenu">
						<div className="closepop" onClick={()=>setPopupActive(false)}><CloseIcon/></div>
						<div className="menuform">
							<form action="submit" className='menu' onSubmit={(e)=>{addTodo(e)}}>
							<input type="text" onChange={(e)=>{setnewTodo(e.target.value)
								console.log(e.target.value)}} value={newTodo} />
							<button onClick={()=>addTodo()}>ADD TODO</button>
							</form>
						</div>
					</div>
				):""}
			</div>
        </div>


  )
}

export default Todo