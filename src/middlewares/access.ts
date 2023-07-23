import { ADMIN_ROLE, MENTOR_ROLE, USER_ROLE } from "../constants/index"

const unauthorized = (res) => res.status(403).send({messsage: 'You are not authorized to perform this action'})

export const isAdminRole = (req, res, next) => {
    if (req?.user?.role === ADMIN_ROLE) return next()
return unauthorized(res)
}

export const isMentorRole = (req, res, next) => {
    if (req.user.role === MENTOR_ROLE) return next()
return unauthorized(res)
}

export const isUserRole = (req, res, next) => {
    if (req.user.role === USER_ROLE) return next()
return unauthorized(res)
}
export const isUserOrMentorRole = (req, res, next) => {
    if (req.user.role === USER_ROLE || req.user.role === MENTOR_ROLE) return next()
return unauthorized(res)
}