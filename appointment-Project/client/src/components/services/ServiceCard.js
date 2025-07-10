import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Divider
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

const ServiceCard = ({ service, showBookButton = true }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/book-appointment/${service._id}`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {service.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            minHeight: '3em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {service.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2">
            {service.duration} minutes
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2">
            ${service.price.toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2">
            {service.category}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {service.staff?.map((staff) => (
            <Chip
              key={staff._id}
              label={staff.name}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      </CardContent>

      {showBookButton && (
        <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            variant="contained"
            onClick={handleBookNow}
            disabled={!service.active}
            fullWidth
            sx={{ mx: 2 }}
          >
            {service.active ? 'Book Now' : 'Currently Unavailable'}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default ServiceCard;