import { supabase } from "../lib/supabaseClient";

export const getCourses = async () => {
  const { data, error } = await supabase
    .from("courses")
    .select("*");

  if (error) {
    console.error("Kurslarni yuklashda xatolik:", error.message);
    return [];
  }

  return data;
};

export const getCourseBySlug = async (slug) => {
  const { data, error } = await supabase
    .from("courses")
    .select("*, lessons(*)")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Slug bo'yicha kursni olishda xatolik:", error.message);
    return null;
  }

  return data;
};

export const getLeaderboard = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("points", { ascending: false });

  if (error) {
    console.error("Leaderboard yuklashda xatolik:", error.message);
    return [];
  }

  return data;
};

export const getAllCourses = getCourses;