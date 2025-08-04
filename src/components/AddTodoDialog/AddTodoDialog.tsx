import React, { useState } from 'react';
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
import { CreateTodoRequest } from '../../types/Todo';

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

interface AddTodoDialogProps {
  trigger: React.ReactElement;
}

const AddTodoDialog: React.FC<AddTodoDialogProps> = ({ trigger }) => {
  const classes = useStyles();
  const { actions, state } = useTodo();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateTodoRequest>({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    due_date: '',
    created_at: new Date().toISOString().split('T')[0], // Default to today
  });

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;

    try {
      await actions.createTodo(formData);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        due_date: '',
        created_at: new Date().toISOString().split('T')[0],
      });
      setOpen(false);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleInputChange = (field: keyof CreateTodoRequest, value: string) => {
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
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <Field label="Title" required className={classes.field}>
            <Input
              value={formData.title}
              onChange={(_, data) => handleInputChange('title', data.value)}
              placeholder="Enter task title..."
            />
          </Field>

          <Field label="Description" className={classes.field}>
            <Textarea
              className={classes.textarea}
              value={formData.description}
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
              value={formData.due_date}
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
            disabled={!formData.title.trim()}
          >
            Add Task
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
};

export default AddTodoDialog;