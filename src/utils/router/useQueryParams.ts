import { useLocation } from 'react-router'

export const useQueryParam = () => new URLSearchParams(useLocation().search)
