import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import blogService from "Utilities/services/blogService";
import { useNotify } from "Utilities/contexts/NotificationContext";

export const useGetAllBlogs = () =>
  useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    retry: false,
    refetchOnWindowFocus: false,
  });

export const useAddBlog = () => {
  const queryClient = useQueryClient();
  const notifyWith = useNotify();

  return useMutation({
    mutationFn: blogService.create,
    onSuccess: ({ title, author, url }) => {
      queryClient.invalidateQueries("blogs");
      notifyWith({
        message: `a new blog ${title} by ${author} added`,
        color: "success",
      });
    },
    onError: (error) => {
      notifyWith({
        message: `${error.response.data.error}`,
        color: "error",
      });
    },
  });
};

export const useLikeBlog = () => {
  const queryClient = useQueryClient();
  const notifyWith = useNotify();

  return useMutation({
    mutationFn: blogService.update,
    onSuccess: ({ title, author }) => {
      queryClient.invalidateQueries("blogs");
      notifyWith({
        message: `You liked '${title}' by '${author}`,
        color: "success",
      });
    },
  });
};

export const useRemoveBlog = () => {
  const queryClient = useQueryClient();
  const notifyWith = useNotify();

  return useMutation({
    mutationFn: blogService.remove,
    onSuccess: (response, { title, author }) => {
      queryClient.invalidateQueries("blogs");
      notifyWith({
        message: `The blog '${title}' by '${author} was removed`,
        color: "success",
      });
    },
  });
};

export const useCommentBlog = () => {
  const queryClient = useQueryClient();
  const notifyWith = useNotify();

  return useMutation({
    mutationFn: blogService.comment,
    onSuccess: () => {
      queryClient.invalidateQueries("blogs");
      notifyWith({
        message: "comment added",
        color: "success",
      });
    },
  });
};
