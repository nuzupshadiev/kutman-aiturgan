import { invitation } from "@/data/invitation";
import type { InvitationData } from "@/types/invitation";

/**
 * The invitation widened to the contract's own shape.
 *
 * `data/invitation.ts` ends in `satisfies InvitationData`, which keeps the
 * literal's exact type — useful there, but it means a component reading an
 * optional member stops compiling the moment that key is taken out of the data
 * file. Optional capabilities are read through this view instead, so a data
 * file with no schedule, no music and no dress code still builds.
 */
export const invitationData: InvitationData = invitation;
