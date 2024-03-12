import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../../api/todoApi";

const TodoList = () => {
  const [newTodo, setNewTodo] = useState("");

  const queryClient = useQueryClient();

  const { isLoading, isError, error, data: todos } = useQuery(
    "todos",
    getTodos,
    {
      select: data => data.sort((a, b) => b.id - a.id)
    }
  );

  const addTodoMutation = useMutation(addTodo, {
    onSuccess: () => {
      // Invalidate the cache and refresh
      queryClient.invalidateQueries("todos");
    }
  });

  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: () => {
      // Invalidate the cache and refresh
      queryClient.invalidateQueries("todos");
    }
  });

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      // Invalidate the cache and refresh
      queryClient.invalidateQueries("todos");
    }
  });

  const handleSubmit = e => {
    e.preventDefault();

    addTodoMutation.mutate({
      userId: 1,
      title: newTodo,
      completed: false
    });

    setNewTodo("");
  };

  const newItemSection = (
    <form onSubmit={handleSubmit}>
      <label htmlFor="new-todo">Enter a new Todo</label>
      <div className="new-todo">
        <input
          type="text"
          id="new-todo"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Enter new Todo"
        />
      </div>
      <button className="submit">Click here !</button>
    </form>
  );

  let content;
  if (isLoading) {
    content = <p>...Loading</p>;
  } else if (isError) {
    content = <p>{error.message}</p>;
  } else {
    content = todos.map(todo => {
      return (
        <article key={todo.id}>
          <div className="todo">
            <input
              type="checkbox"
              checked={todo.completed}
              id={todo.id}
              onChange={() =>
                updateTodoMutation.mutate({
                  ...todo,
                  completed: !todo.completed
                })
              }
            />
            <label htmlFor={todo.id}>{todo.title}</label>
          </div>

          <button onClick={() => deleteTodoMutation.mutate({ id: todo.id })}>
            Delete !
          </button>
        </article>
      );
    });
  }

  return (
    <div>
      <h1>Todo List</h1>
      {newItemSection}
      {content}
    </div>
  );
};

export default TodoList;
