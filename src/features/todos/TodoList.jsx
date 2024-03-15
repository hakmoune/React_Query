import { useState } from "react";
import { useToggle } from "@uidotdev/usehooks";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../../api/todoApi";

const TodoList = () => {
  const [newTodo, setNewTodo] = useState("");
  // const [enabled, toggleEnabled] = useToggle(false);

  const queryClient = useQueryClient();

  // Get Resources from the server
  const {
    isLoading,
    isError,
    error,
    data: todos,
    refetch,
    isFetching
  } = useQuery(
    "todos", // The key
    getTodos,
    {
      select: data => data.sort((a, b) => b.id - a.id),
      refetchOnWindowFocus: false
      //staleTime: 60_000
      //enabled: false, // bloque le fetch des donnees
      //enabled // bloque and unblok le fetch des donnees
    }
  );

  // Update Ressources on the server
  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
    onError: error => {
      console.error(error);
    }
  });

  // Add Ressources on the server
  const addTodoMutation = useMutation(addTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
    onError: error => {
      console.error(error);
    }
  });

  const handleClick = () => {
    addTodoMutation.mutate({
      userId: 256,
      id: "430",
      title: newTodo,
      completed: false
    });
    setNewTodo("");
  };

  // Delete Ressources on the server
  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
    onError: error => {
      console.error(error);
    }
  });

  return (
    <div>
      <h1>Todo List</h1>
      {/*<button onClick={() => refetch()}>Refesh Data</button>*/}
      {/*{isFetching && <div>Fetching...</div>}*/}
      {/*<button onClick={toggleEnabled}>Refesh Data</button>*/}
      <input
        type="text"
        value={newTodo}
        onChange={e => setNewTodo(e.target.value)}
      />
      <button onClick={handleClick}>Add new Todo</button>

      {todos?.map(todo => (
        <div key={todo.id}>
          <p>{todo.title}</p>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => {
              updateTodoMutation.mutate({
                ...todo,
                completed: !todo.completed
              });
            }}
          />
          <button onClick={() => deleteTodoMutation.mutate(todo)}>
            Delete !
          </button>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
