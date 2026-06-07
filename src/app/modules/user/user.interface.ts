export type IUser = {
	name?: string
	email: string
	// bcrypt hash — only present for accounts registered via /auth/register
	// (legacy accounts authenticate through Firebase and have no password)
	password?: string
	photo?: string
	role?: string
	premium?: boolean
	// Biodata fields (all optional — filled in via the edit-biodata form)
	age?: string
	dof?: string
	gender?: string
	height?: string
	weight?: string
	occupation?: string
	race?: string
	fatherName?: string
	motherName?: string
	permanentDivision?: string
	presentDivision?: string
	partnerAge?: string
	partnerHeight?: string
	partnerWeight?: string
	phone?: string
}
