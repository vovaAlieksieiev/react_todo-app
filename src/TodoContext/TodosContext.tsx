import React, { useMemo, useState } from 'react';
import { Todo } from '../Interface/Todo';
import { Status } from '../Enum/Status';
import { useLocalStorage } from '../hooks/UseLocalStorage';

type TodoContext = {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  isToggleAllStatus: boolean,
  setIsToggleAllStatus: (status: boolean) => void,
  setFilterBy: (value: Status) => void,
  filterBy: Status,
  todosFilter: () => Todo[],
};

type Props = {
  children: React.ReactNode;
};

export const TodosContext = React.createContext<TodoContext>({
  todos: [],
  setTodos: () => {},
  isToggleAllStatus: false,
  setIsToggleAllStatus: () => {},
  setFilterBy: () => {},
  filterBy: Status.ALL,
  todosFilter: () => [],
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [isToggleAllStatus, setIsToggleAllStatus]
  = useState<boolean>(false);
  const [filterBy, setFilterBy] = useState<Status>(Status.ALL);

  const todosFilter = () => {
    switch (filterBy) {
      case Status.ALL:
        return todos;
      case Status.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case Status.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const todoState = useMemo(() => ({
    todos,
    setTodos,
    isToggleAllStatus,
    setIsToggleAllStatus,
    filterBy,
    setFilterBy,
    todosFilter,
  }), [todos, filterBy]);

  return (
    <TodosContext.Provider value={todoState}>
      {children}
    </TodosContext.Provider>
  );
};