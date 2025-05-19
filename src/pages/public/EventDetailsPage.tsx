import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  LocationOn,
  CalendarToday,
  AccessTime,
  People,
  Group,
} from "@mui/icons-material";
import { getImageUrl } from "../../utils/imageUtils";
import { useAuth } from "../../contexts/AuthContext";
import eventService, { Event } from "../../services/eventService";

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  console.log("ID récupéré de l'URL:", id);

  const {
    data: event,
    isLoading,
    error,
  } = useQuery<Event, Error>(
    ["event", id],
    async () => {
      console.log("Début de la requête pour l'événement:", id);

      if (!id) {
        console.error("ID d'événement manquant");
        throw new Error("ID d'événement manquant");
      }

      try {
        const event = await eventService.getEventById(parseInt(id));
        if (!event) {
          throw new Error("Événement non trouvé");
        }
        return event;
      } catch (err) {
        console.error("Erreur lors de la récupération de l'événement:", err);
        throw err;
      }
    },
    {
      enabled: !!id,
      retry: (failureCount, error) => {
        console.log("Tentative de nouvelle requête:", {
          failureCount,
          error,
        });
        return failureCount < 3;
      },
      retryDelay: 1000,
      onError: (err) => {
        console.error("Erreur finale React Query:", err);
      },
    }
  );

  console.log("État du composant:", {
    isLoading,
    error,
    id,
    hasEvent: !!event,
  });

  // ... rest of the component code ...
};

export default EventDetailsPage;
