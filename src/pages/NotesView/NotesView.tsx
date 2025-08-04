import React, { useState, useEffect } from 'react';
import {
  Text,
  Card,
  Button,
  Input,
  makeStyles,
  shorthands,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover,
} from '@fluentui/react-components';
import {
  Add20Regular,
  Search20Regular,
  Grid20Regular,
  List20Regular,
  MoreHorizontal20Regular,
  Delete20Regular,
  Edit20Regular,
  Pin20Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    ...shorthands.padding('0'),
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    color: '#323130',
  },
  header: {
    ...shorthands.padding('24px', '0'),
    marginBottom: '24px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '400',
    color: '#e8eaed',
    marginBottom: '16px',
  },
  searchContainer: {
    position: 'relative',
    maxWidth: '600px',
    margin: '0 auto',
    marginBottom: '24px',
  },
  searchInput: {
    width: '100%',
    backgroundColor: '#ffffff',
    ...shorthands.border('1px', 'solid', '#e1dfdd'),
    ...shorthands.borderRadius('24px'),
    ...shorthands.padding('12px', '48px', '12px', '16px'),
    color: '#323130',
    fontSize: '16px',
    '&:focus': {
      backgroundColor: '#ffffff',
      ...shorthands.border('1px', 'solid', '#0078d4'),
      boxShadow: '0 1px 6px rgba(0, 120, 212, 0.2)',
    },
  },
  searchIcon: {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#605e5c',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  viewToggle: {
    display: 'flex',
    gap: '8px',
  },
  viewButton: {
    width: '40px',
    height: '40px',
    ...shorthands.borderRadius('50%'),
    backgroundColor: 'transparent',
    ...shorthands.border('none'),
    color: '#605e5c',
    '&:hover': {
      backgroundColor: '#f3f2f1',
      color: '#323130',
    },
    '&.active': {
      backgroundColor: '#0078d4',
      color: '#ffffff',
    },
  },
  addButton: {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    width: '56px',
    height: '56px',
    ...shorthands.borderRadius('50%'),
    backgroundColor: '#0078d4',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 120, 212, 0.3)',
    zIndex: 1000,
    '&:hover': {
      backgroundColor: '#106ebe',
    },
  },
  notesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  notesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  noteCard: {
    ...shorthands.padding('16px'),
    backgroundColor: '#ffffff',
    ...shorthands.border('1px', 'solid', '#e1dfdd'),
    ...shorthands.borderRadius('8px'),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    '&:hover': {
      ...shorthands.border('1px', 'solid', '#0078d4'),
      boxShadow: '0 1px 6px rgba(32,33,36,.28)',
    },
  },
  pinnedNote: {
    ...shorthands.border('1px', 'solid', '#ffb900'),
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-1px',
      left: '-1px',
      right: '-1px',
      height: '3px',
      backgroundColor: '#ffb900',
      ...shorthands.borderRadius('8px', '8px', '0', '0'),
    },
  },
  noteHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  noteTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#323130',
    marginBottom: '8px',
    wordBreak: 'break-word',
  },
  noteContent: {
    fontSize: '14px',
    color: '#605e5c',
    lineHeight: '1.4',
    marginBottom: '12px',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  noteFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
  },
  noteLabels: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  noteLabel: {
    fontSize: '12px',
    backgroundColor: '#f3f2f1',
    color: '#605e5c',
    ...shorthands.padding('2px', '8px'),
    ...shorthands.borderRadius('12px'),
  },
  noteDate: {
    fontSize: '12px',
    color: '#605e5c',
  },
  noteActions: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    '$noteCard:hover &': {
      opacity: 1,
    },
  },
  colorPicker: {
    display: 'flex',
    gap: '8px',
    ...shorthands.padding('8px'),
  },
  colorOption: {
    width: '24px',
    height: '24px',
    ...shorthands.borderRadius('50%'),
    ...shorthands.border('2px', 'solid', 'transparent'),
    cursor: 'pointer',
    '&:hover': {
      ...shorthands.border('2px', 'solid', '#8ab4f8'),
    },
  },
  newNoteModal: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  newNoteCard: {
    backgroundColor: '#ffffff',
    ...shorthands.borderRadius('8px'),
    ...shorthands.padding('24px'),
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
  newNoteTitle: {
    width: '100%',
    backgroundColor: 'transparent',
    ...shorthands.border('none'),
    color: '#323130',
    fontSize: '20px',
    fontWeight: '500',
    marginBottom: '16px',
    ...shorthands.padding('0'),
    '&:focus': {
      outline: 'none',
    },
    '&::placeholder': {
      color: '#605e5c',
    },
  },
  newNoteContent: {
    width: '100%',
    backgroundColor: 'transparent',
    ...shorthands.border('none'),
    color: '#323130',
    fontSize: '14px',
    minHeight: '200px',
    resize: 'vertical',
    ...shorthands.padding('0'),
    fontFamily: 'inherit',
    '&:focus': {
      outline: 'none',
    },
    '&::placeholder': {
      color: '#605e5c',
    },
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
  },
});

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  labels: string[];
  createdAt: string;
  updatedAt: string;
}

const noteColors = [
  { name: 'Default', value: '#ffffff' },
  { name: 'Red', value: '#ffeaea' },
  { name: 'Orange', value: '#fff4e6' },
  { name: 'Yellow', value: '#fffbf0' },
  { name: 'Green', value: '#f3f9f1' },
  { name: 'Teal', value: '#e6f7ff' },
  { name: 'Blue', value: '#f0f8ff' },
  { name: 'Dark Blue', value: '#e8f4fd' },
  { name: 'Purple', value: '#f4f1fb' },
  { name: 'Pink', value: '#fdf2f8' },
];

const NotesView: React.FC = () => {
  const classes = useStyles();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGridView, setIsGridView] = useState(true);
  const [showNewNote, setShowNewNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  useEffect(() => {
    // Initialize with sample notes
    const sampleNotes: Note[] = [
      {
        id: '1',
        title: 'Project Ideas',
        content: 'Build a task manager\nCreate a weather app\nDevelop a music player\nDesign a portfolio website',
        color: '#f3f9f1',
        isPinned: true,
        labels: ['development', 'ideas'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Shopping List',
        content: 'Milk\nBread\nEggs\nApples\nChicken\nRice',
        color: '#fff4e6',
        isPinned: false,
        labels: ['personal'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Meeting Notes',
        content: 'Discussed Q4 goals\n- Increase productivity by 20%\n- Launch new feature\n- Improve user experience\n\nAction items:\n- Research competitors\n- Create mockups\n- Schedule user testing',
        color: '#e6f7ff',
        isPinned: false,
        labels: ['work', 'meetings'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    setNotes(sampleNotes);
  }, []);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.labels.some(label => label.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned);

  const createNote = () => {
    if (!newNoteTitle.trim() && !newNoteContent.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteTitle.trim() || 'Untitled',
      content: newNoteContent.trim(),
      color: selectedColor,
      isPinned: false,
      labels: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingNote) {
      setNotes(prev => prev.map(note =>
        note.id === editingNote.id
          ? { ...note, title: newNoteTitle, content: newNoteContent, color: selectedColor, updatedAt: new Date().toISOString() }
          : note
      ));
    } else {
      setNotes(prev => [newNote, ...prev]);
    }

    setShowNewNote(false);
    setEditingNote(null);
    setNewNoteTitle('');
    setNewNoteContent('');
    setSelectedColor('#ffffff');
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const togglePin = (noteId: string) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId
        ? { ...note, isPinned: !note.isPinned, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const editNote = (note: Note) => {
    setEditingNote(note);
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);
    setSelectedColor(note.color);
    setShowNewNote(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderNote = (note: Note) => (
    <Card
      key={note.id}
      className={`${classes.noteCard} ${note.isPinned ? classes.pinnedNote : ''}`}
      style={{ backgroundColor: note.color }}
      onClick={() => editNote(note)}
    >
      <div className={classes.noteHeader}>
        <Text className={classes.noteTitle}>{note.title}</Text>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button
              appearance="subtle"
              icon={<MoreHorizontal20Regular />}
              size="small"
              onClick={(e) => e.stopPropagation()}
            />
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem
                icon={<Pin20Regular />}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(note.id);
                }}
              >
                {note.isPinned ? 'Unpin' : 'Pin note'}
              </MenuItem>
              <MenuItem
                icon={<Edit20Regular />}
                onClick={(e) => {
                  e.stopPropagation();
                  editNote(note);
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                icon={<Delete20Regular />}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
              >
                Delete
              </MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
      
      <Text className={classes.noteContent}>{note.content}</Text>
      
      <div className={classes.noteFooter}>
        <div className={classes.noteLabels}>
          {note.labels.map(label => (
            <div key={label} className={classes.noteLabel}>
              {label}
            </div>
          ))}
        </div>
        <Text className={classes.noteDate}>{formatDate(note.updatedAt)}</Text>
      </div>
    </Card>
  );

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Text className={classes.title}>Notes</Text>
        
        <div className={classes.searchContainer}>
          <Input
            className={classes.searchInput}
            placeholder="Search your notes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search20Regular className={classes.searchIcon} />
        </div>

        <div className={classes.toolbar}>
          <div className={classes.viewToggle}>
            <Button
              className={`${classes.viewButton} ${isGridView ? 'active' : ''}`}
              icon={<Grid20Regular />}
              onClick={() => setIsGridView(true)}
            />
            <Button
              className={`${classes.viewButton} ${!isGridView ? 'active' : ''}`}
              icon={<List20Regular />}
              onClick={() => setIsGridView(false)}
            />
          </div>
        </div>
      </div>

      <div className={isGridView ? classes.notesGrid : classes.notesList}>
        {pinnedNotes.length > 0 && (
          <>
            <div style={{ gridColumn: '1 / -1', color: '#9aa0a6', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Pinned
            </div>
            {pinnedNotes.map(renderNote)}
          </>
        )}
        
        {unpinnedNotes.length > 0 && pinnedNotes.length > 0 && (
          <div style={{ gridColumn: '1 / -1', color: '#9aa0a6', fontSize: '12px', textTransform: 'uppercase', margin: '24px 0 8px 0' }}>
            Others
          </div>
        )}
        
        {unpinnedNotes.map(renderNote)}
      </div>

      <Button
        className={classes.addButton}
        icon={<Add20Regular />}
        onClick={() => setShowNewNote(true)}
      />

      {showNewNote && (
        <div className={classes.newNoteModal} onClick={() => setShowNewNote(false)}>
          <Card className={classes.newNoteCard} onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              className={classes.newNoteTitle}
              placeholder="Title"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
            />
            <textarea
              className={classes.newNoteContent}
              placeholder="Take a note..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
            />
            
            <div className={classes.modalActions}>
              <div className={classes.colorPicker}>
                {noteColors.map(color => (
                  <div
                    key={color.value}
                    className={classes.colorOption}
                    style={{ 
                      backgroundColor: color.value,
                      border: selectedColor === color.value ? '2px solid #8ab4f8' : '2px solid transparent'
                    }}
                    onClick={() => setSelectedColor(color.value)}
                  />
                ))}
              </div>
              
              <div className={classes.modalButtons}>
                <Button
                  appearance="subtle"
                  onClick={() => {
                    setShowNewNote(false);
                    setEditingNote(null);
                    setNewNoteTitle('');
                    setNewNoteContent('');
                    setSelectedColor('#ffffff');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  appearance="primary"
                  onClick={createNote}
                >
                  {editingNote ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotesView;