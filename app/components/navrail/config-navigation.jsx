import { AccountTree, BookRounded, Groups, LockPersonRounded, NotInterestedRounded, TableChart } from "@mui/icons-material";

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <TableChart />,
  },
  {
    title: 'Matchup Analyzer',
    path: '/user',
    icon: <AccountTree />,
  },
  {
    title: 'Team Analyzer',
    path: '/products',
    icon: <Groups />,
  },
  {
    title: 'blog',
    path: '/blog',
    icon: <BookRounded />,
  },
  {
    title: 'login',
    path: '/login',
    icon: <LockPersonRounded />,
  },
  {
    title: 'Not found',
    path: '/404',
    icon: <NotInterestedRounded />,
  },
];

export default navConfig;
