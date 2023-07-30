import LoadingSkeleton from "@/components/loading/LoadingSkeleton"
import { useGetTutorialByIdQuery } from "@/store/features/tutorial/tutorialApiSlice"

export default function TutorialDetail({content}) {
    

  return (
    <div>
    <div
      id="html-content"
     
      dangerouslySetInnerHTML={{ __html: content }}
    />
  </div>
  )
}