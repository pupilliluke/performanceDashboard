import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Field,
  Input,
  Textarea,
  Dropdown,
  Option,
  makeStyles,
} from '@fluentui/react-components';
import { useTodo } from '../../context/TodoContext';
import { Todo, UpdateTodoRequest } from '../../types/Todo';

const useStyles = makeStyles({
  dialog: {
    width: '500px',
  },
  field: {
    marginBottom: '16px',
  },
  textarea: {
    minHeight: '80px',
  },
});

interface EditTodoDialogProps {
  trigger: React.ReactElement;
  todo: Todo;
}

const EditTodoDialog: React.FC<EditTodoDialogProps> = ({ trigger, todo }) => {
  const classes = useStyles();
  const { actions, state } = useTodo();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<UpdateTodoRequest & { created_at?: string }>({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
    status: todo.status,
    category: todo.category,
    due_date: todo.due_date || '',
    created_at: todo.created_at ? new Date(todo.created_at).toISOString().split('T')[0] : '',
  });

  useEffect(() => {
    if (open) {
      setFormData({
        title: todo.title,
        description: todo.description || '',
        priority: todo.priority,
        status: todo.status,
        category: todo.category,
        due_date: todo.due_date || '',
        created_at: todo.created_at ? new Date(todo.created_at).toISOString().split('T')[0] : '',
      });
    }
  }, [open, todo]);

  const handleSubmit = async () => {
    if (!formData.title?.trim()) return;

    try {
      const updateData = { ...formData };
      
      // If created_at was changed, convert it to ISO string
      if (formData.created_at && formData.created_at !== new Date(todo.created_at).toISOString().split('T')[0]) {
        const newCreatedAt = new Date(formData.created_at + 'T00:00:00.000Z').toISOString();
        updateData.created_at = newCreatedAt;
      }
      
      await actions.updateTodo(todo.id, updateData);
      setOpen(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleInputChange = (field: keyof (UpdateTodoRequest & { created_at?: string }), value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => setOpen(data.open)}>
      <DialogTrigger disableButtonEnhancement>
        {trigger}
      </DialogTrigger>
      <DialogSurface className={classes.dialog}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <Field label="Title" required className={classes.field}>
            <Input
              value={formData.title || ''}
              onChange={(_, data) => handleInputChange('title', data.value)}
              placeholder="Enter task title..."
            />
          </Field>

          <Field label="Description" className={classes.field}>
            <Textarea
              className={classes.textarea}
              value={formData.description || ''}
              onChange={(_, data) => handleInputChange('description', data.value)}
              placeholder="Enter task description..."
            />
          </Field>

          <Field label="Priority" className={classes.field}>
            <Dropdown
              value={formData.priority}
              selectedOptions={[formData.priority || '']}
              onOptionSelect={(_, data) => handleInputChange('priority', data.optionValue as string)}
            >
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Dropdown>
          </Field>

          <Field label="Status" className={classes.field}>
            <Dropdown
              value={formData.status}
              selectedOptions={[formData.status || '']}
              onOptionSelect={(_, data) => handleInputChange('status', data.optionValue as string)}
            >
              <Option value="pending">Pending</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="completed">Completed</Option>
            </Dropdown>
          </Field>

          <Field label="Category" className={classes.field}>
            <Dropdown
              value={formData.category}
              selectedOptions={[formData.category || '']}
              onOptionSelect={(_, data) => handleInputChange('category', data.optionValue as string)}
              placeholder="Select category..."
            >
              {state.categories.map(category => (
                <Option key={category.id} value={category.name}>
                  {category.name}
                </Option>
              ))}
            </Dropdown>
          </Field>

          <Field label="Created Date" className={classes.field}>
            <Input
              type="date"
              value={formData.created_at || ''}
              onChange={(_, data) => handleInputChange('created_at', data.value)}
            />
          </Field>

          <Field label="Due Date" className={classes.field}>
            <Input
              type="date"
              value={formData.due_date || ''}
              onChange={(_, data) => handleInputChange('due_date', data.value)}
            />
          </Field>
        </DialogContent>
        <DialogActions>
          <Button appearance="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            appearance="primary"
            onClick={handleSubmit}
            disabled={!formData.title?.trim()}
          >
            Save Changes
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
};

export default EditTodoDialog;