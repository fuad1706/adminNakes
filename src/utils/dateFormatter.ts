//import { format, parseISO, addDays } from "date-fns";
import { format, parseISO } from "date-fns";
/**
 * Formats a date string or Date object into a readable format (e.g., "15 Apr, 2024")
 * Ensures consistent display regardless of timezone issues
 */
export const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) return "Date not available";

  try {
    let date: Date;

    if (typeof dateString === "string") {
      // For YYYY-MM-DD format (the most common case from forms)
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        // This is critical - we need to handle timezone offset properly
        const [year, month, day] = dateString.split("-").map(Number);

        // Create date using UTC to avoid timezone shifts
        date = new Date(Date.UTC(year, month - 1, day));

        // Adjust for the timezone offset if needed
        const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
        date = new Date(date.getTime() + userTimezoneOffset);
      }
      // Handle DD/MM/YYYY format
      else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        const [day, month, year] = dateString.split("/").map(Number);
        date = new Date(Date.UTC(year, month - 1, day));
      }
      // Handle ISO format with T
      else if (dateString.includes("T")) {
        // For ISO strings, parse directly but be aware of timezone
        date = new Date(dateString);
      }
      // Fallback
      else {
        date = parseISO(dateString);
      }
    } else {
      date = dateString;
    }

    if (isNaN(date.getTime())) {
      console.error("Invalid date value:", dateString);
      return "Date not available";
    }

    // Format the date
    return format(date, "d MMM, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error, "Input was:", dateString);
    return "Date not available";
  }
};

/**
 * Formats a date for form input (YYYY-MM-DD format)
 * Ensures the correct date is displayed in form inputs regardless of timezone
 */
export const formatDateForInput = (
  dateString: string | Date | undefined
): string => {
  if (!dateString) return "";

  try {
    let date: Date;

    if (typeof dateString === "string") {
      // For YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        // To avoid timezone issues, simply return the string as is
        return dateString;
      }
      // For ISO format with time component
      else if (dateString.includes("T")) {
        // Extract just the date part, ignoring time and timezone
        return dateString.split("T")[0];
      }
      // For other formats
      else {
        // Parse and convert to YYYY-MM-DD
        date = parseISO(dateString);
      }
    } else {
      date = dateString;
    }

    if (isNaN(date.getTime())) {
      return "";
    }

    // Format as YYYY-MM-DD
    return format(date, "yyyy-MM-dd");
  } catch (error) {
    console.error("Error formatting date for input:", error);
    return "";
  }
};

/**
 * Special function to handle date submission from form to server
 * This is critical for fixing the timezone issue where dates shift by one day
 */
export const prepareFormDateForSubmission = (dateStr: string): string => {
  // For YYYY-MM-DD format from date inputs
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    // Parse the date and add 1 day to compensate for timezone issue
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    // Add one day to counteract the timezone shift during submission
    //const adjustedDate = addDays(date, 1);

    // Return in YYYY-MM-DD format this adds one day to the date
    //return format(adjustedDate, "yyyy-MM-dd");

    return format(date, "yyyy-MM-dd");
  }

  // Return original string if not in expected format
  return dateStr;
};

/**
 * Process a date received from the server to display in the UI
 * This compensates for any server-side timezone adjustments
 */
export const processServerDate = (dateStr: string | Date): string => {
  if (!dateStr) return "";

  try {
    let date: Date;

    if (typeof dateStr === "string") {
      // For ISO format with time
      if (dateStr.includes("T")) {
        date = new Date(dateStr);
      }
      // For YYYY-MM-DD format
      else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split("-").map(Number);
        date = new Date(year, month - 1, day);
      }
      // Fallback
      else {
        date = parseISO(dateStr);
      }
    } else {
      date = dateStr;
    }

    return format(date, "yyyy-MM-dd");
  } catch (error) {
    console.error("Error processing server date:", error);
    return "";
  }
};
