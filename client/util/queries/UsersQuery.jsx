/* eslint-disable import/prefer-default-export */
import { useQuery } from "@tanstack/react-query";
import userService from "Utilities/services/usersService";

export const useGetAllUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    retry: false,
    refetchOnWindowFocus: false,
  });
