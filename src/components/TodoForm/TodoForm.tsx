import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogBody,
  Button,
  Input,
  Textarea,
  Field,
  Dropdown,
  Option,
  makeStyles,
} from '@fluentui/react-components';
import { Add20Regular } from '@fluentui/react-icons';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../../types/Todo';
import { useTodo } from '../../context/TodoContext';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  dialogContent: {
    minWidth: '500px',
  },
});

interface TodoFormProps {
  todo?: Todo;
  isOpen: boolean;
  onClose: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ todo, isOpen, onClose }) => {
  const classes = useStyles();
  const { actions, state } = useTodo();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'pending' as 'pending' | 'in_progress' | 'completed',
    category: 'personal',
    due_date: '',
  });

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || '',
        priority: todo.priority,
        status: todo.status,
        category: todo.category,
        due_date: todo.due_date ? todo.due_date.split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        category: 'personal',
        due_date: '',
      });
    }
  }, [todo, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    const todoData = {
      ...formData,
      due_date: formData.due_date || undefined,
    };

    try {
      if (todo) {
        await actions.updateTodo(todo.id, todoData as UpdateTodoRequest);
      } else {
        await actions.createTodo(todoData as CreateTodoRequest);
      }
      onClose();
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={classes.dialogContent}>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <DialogTitle>{todo ? 'Edit Todo' : 'Create New Todo'}</DialogTitle>
            <DialogContent>
              <div className={classes.form}>
                <Field label="Title" required>
                  <Input
                    value={formData.title}
                    onChange={(_, data) => handleInputChange('title', data.value)}
                    placeholder="Enter todo title..."
                  />
                </Field>

                <Field label="Description">
                  <Textarea
                    value={formData.description}
                    onChange={(_, data) => handleInputChange('description', data.value)}
                    placeholder="Enter description (optional)..."
                    rows={3}
                  />
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Priority">
                    <Dropdown
                      value={formData.priority}
                      selectedOptions={[formData.priority]}
                      onOptionSelect={(_, data) => handleInputChange('priority', data.optionValue as string)}
                    >
                      <Option value="low">Low</Option>
                      <Option value="medium">Medium</Option>
                      <Option value="high">High</Option>
                    </Dropdown>
                  </Field>

                  <Field label="Status">
                    <Dropdown
                      value={formData.status}
                      selectedOptions={[formData.status]}
                      onOptionSelect={(_, data) => handleInputChange('status', data.optionValue as string)}
                    >
                      <Option value="pending">Pending</Option>
                      <Option value="in_progress">In Progress</Option>
                      <Option value="completed">Completed</Option>
                    </Dropdown>
                  </Field>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Category">
                    <Dropdown
                      value={formData.category}
                      selectedOptions={[formData.category]}
                      onOptionSelect={(_, data) => handleInputChange('category', data.optionValue as string)}
                    >
                      {state.categories.map(category => (
                        <Option key={category.id} value={category.id}>
                          {category.name}
                        </Option>
                      ))}
                    </Dropdown>
                  </Field>

                  <Field label="Due Date">
                    <Input
                      type="date"
                      value={formData.due_date}
                      onChange={(_, data) => handleInputChange('due_date', data.value)}
                    />
                  </Field>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancel</Button>
              </DialogTrigger>
              <Button appearance="primary" type="submit">
                {todo ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
};

export const CreateTodoButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        appearance="primary"
        icon={<Add20Regular />}
        onClick={() => setIsOpen(true)}
      >
        Add Todo
      </Button>
      <TodoForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default TodoForm;