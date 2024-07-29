import moment from "moment";
import { useCallback } from "react";

const useDateTimeFormat = () => {
  const formatDateTime = useCallback((value: any, format: string = "lll") => {
    const date = moment(value);
    if (!date.isValid()) {
      return null; // or any other default value/message
    }
    return date.format(format);
  }, []);

  return formatDateTime;
};

export default useDateTimeFormat;
