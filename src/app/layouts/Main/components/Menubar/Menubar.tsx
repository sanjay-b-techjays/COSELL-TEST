import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import HistoryIcon from '@material-ui/icons/History';
import BookIcon from '@material-ui/icons/Book';
import { useHistory } from 'react-router-dom';

export default function Menubar() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const history = useHistory();

  const handleListItemClick = (index: number, href: string) => {
    setSelectedIndex(index);
    history.push(href);
  };

  const pages = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <DashboardIcon />,
    },
    {
      title: 'Profile',
      href: '/profile',
      icon: <SettingsEthernetIcon />,
    },
    {
      title: 'Menu 2',
      href: '/menu2',
      icon: <HistoryIcon />,
    },
    {
      title: 'Menu 3',
      href: '/menu3',
      icon: <BookIcon />,
    },
  ];
  return (
    <Box sx={{ width: '100%' }}>
      <List component="nav" aria-label="secondary mailbox folder">
        {pages.map((page, index) => (
          <ListItemButton
            key={page.title}
            selected={selectedIndex === index}
            onClick={(event) => handleListItemClick(index, page.href)}
          >
            <ListItemIcon>{page.icon}</ListItemIcon>
            <ListItemText primary={page.title} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
