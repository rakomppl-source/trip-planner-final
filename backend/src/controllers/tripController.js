import { prisma } from "../config/prisma.js";

const ensureTripOwnership = async (tripId, userId) => {
  return prisma.trip.findFirst({
    where: {
      id: tripId,
      user_id: userId
    }
  });
};

export const getTrips = async (req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { user_id: req.user.sub },
      orderBy: { created_at: "desc" }
    });

    return res.json(trips);
  } catch (error) {
    return next(error);
  }
};

export const createTrip = async (req, res, next) => {
  try {
    const { nazwa, data_rozpoczecia, data_zakonczenia } = req.body;

    if (!nazwa || !data_rozpoczecia || !data_zakonczenia) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const trip = await prisma.trip.create({
      data: {
        user_id: req.user.sub,
        nazwa,
        data_rozpoczecia: new Date(data_rozpoczecia),
        data_zakonczenia: new Date(data_zakonczenia)
      }
    });

    return res.status(201).json(trip);
  } catch (error) {
    return next(error);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    const trip = await ensureTripOwnership(req.params.id, req.user.sub);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    await prisma.trip.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export const getTripDestinations = async (req, res, next) => {
  try {
    const trip = await ensureTripOwnership(req.params.id, req.user.sub);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const destinations = await prisma.destination.findMany({
      where: { trip_id: req.params.id },
      orderBy: { kolejnosc: "asc" }
    });

    return res.json(destinations);
  } catch (error) {
    return next(error);
  }
};

export const createTripDestination = async (req, res, next) => {
  try {
    const trip = await ensureTripOwnership(req.params.id, req.user.sub);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const { nazwa_miejsca, latitude, longitude, kolejnosc } = req.body;

    if (
      !nazwa_miejsca ||
      latitude === undefined ||
      longitude === undefined ||
      kolejnosc === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const destination = await prisma.destination.create({
      data: {
        trip_id: req.params.id,
        nazwa_miejsca,
        latitude: Number(latitude),
        longitude: Number(longitude),
        kolejnosc: Number(kolejnosc)
      }
    });

    return res.status(201).json(destination);
  } catch (error) {
    return next(error);
  }
};

export const deleteDestination = async (req, res, next) => {
  try {
    const destination = await prisma.destination.findFirst({
      where: {
        id: req.params.id,
        trip: { user_id: req.user.sub }
      }
    });

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    await prisma.destination.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
