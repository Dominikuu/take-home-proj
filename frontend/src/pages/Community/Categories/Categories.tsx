import React from 'react';
import {Container} from 'react-bootstrap';
import {Box, Grid, Paper, Card,  CardActionArea,  Typography,  CardContent,  BookmarksIcon} from 'lib/mui-shared'
import { experimentalStyled as styled } from '@mui/material/styles';
import './Categories.scss';
const Item = styled(CardContent)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const CATEGORIES = [
  {
    label: 'Unitik News',
    iconComponent: <BookmarksIcon fontSize="large"/>,
    link: '#/posts/'
  },
  {
    label: 'Product',
    iconComponent: <BookmarksIcon fontSize="large"/>,
    link: '#/posts/?category=product'
  },
  {
    label: 'Story',
    iconComponent: <BookmarksIcon fontSize="large"/>,
    link: '#/posts/?category=story'
  },
  {
    label: 'Idea',
    iconComponent: <BookmarksIcon fontSize="large"/>,
    link: '#/posts/?category=idea'
  },
  {
    label: 'Training',
    iconComponent: <BookmarksIcon fontSize="large"/>,
    link: '#/posts/?category=training'
  },
  {
    label: 'Blog',
    iconComponent: <BookmarksIcon fontSize="large"/>,
    link: '#/posts/?category=blog'
  }
]
const Categories = () => (
  <Container className="Categories block">
    <h4>Categories</h4>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {CATEGORIES.map((_, index) => (
          <Grid item xs={2} sm={4} md={2} key={index}>
            <Card sx={{ maxWidth: 300 }}>
              <CardActionArea href={_.link}>
                <CardContent>
                  <Item>
                    {_.iconComponent}
                  </Item>
                  <Typography gutterBottom variant="h5" component="div" align='center'>
                    {_.label}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>

  </Container>
);

export default Categories;
